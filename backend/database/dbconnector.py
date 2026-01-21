import os
import threading
import sqlite3
import uuid
from datetime import datetime

class SingletonMeta(type):
    _instances = {}
    _lock = threading.Lock()
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            with cls._lock:
                if cls not in cls._instances:
                    instance = super().__call__(*args, **kwargs)
                    cls._instances[cls] = instance
        return cls._instances[cls]


class DatabaseConnector(metaclass=SingletonMeta):
    def __init__(self, db_path="database/jobs.db"):
        self.db_path = db_path
        self._lock = threading.Lock()
        self._init_database()
    
    def _init_database(self):
        """Initialize the database and create tables if they don't exist."""
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS jobs (
                    job_id TEXT PRIMARY KEY,
                    image_name TEXT NOT NULL,
                    status TEXT NOT NULL,
                    prompt TEXT,
                    height INTEGER,
                    width INTEGER,
                    num_inference_steps INTEGER,
                    created_at TEXT NOT NULL,
                    completed_at TEXT,
                    error_message TEXT
                )
            """)
            conn.commit()
    
    def create_job(self, prompt: str, height: int, width: int, num_inference_steps: int, image_name: str):
        """Create a new job entry in the database."""
        job_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        
        with self._lock:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO jobs (job_id, image_name, status, prompt, height, width, 
                                     num_inference_steps, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (job_id, image_name, "generating", prompt, height, width, 
                      num_inference_steps, created_at))
                conn.commit()
        
        return job_id
    
    def update_job_status(self, job_id: str, status: str, error_message: str = None):
        """Update the status of a job."""
        completed_at = datetime.utcnow().isoformat() if status in ["completed", "failed"] else None
        
        with self._lock:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                if error_message:
                    cursor.execute("""
                        UPDATE jobs 
                        SET status = ?, completed_at = ?, error_message = ?
                        WHERE job_id = ?
                    """, (status, completed_at, error_message, job_id))
                else:
                    cursor.execute("""
                        UPDATE jobs 
                        SET status = ?, completed_at = ?
                        WHERE job_id = ?
                    """, (status, completed_at, job_id))
                conn.commit()
    
    def get_job(self, job_id: str):
        """Retrieve job information by job_id."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM jobs WHERE job_id = ?", (job_id,))
            row = cursor.fetchone()
            if row:
                return dict(row)
            return None
    
    def get_job_by_image_name(self, image_name: str):
        """Retrieve job information by image_name."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM jobs WHERE image_name = ?", (image_name,))
            row = cursor.fetchone()
            if row:
                return dict(row)
            return None