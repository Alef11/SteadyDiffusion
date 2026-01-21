import datetime
import os

def get_save_location():
    # Get the project root directory (two levels up from this file)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(current_dir))
    outputs_dir = os.path.join(project_root, "outputs")
    
    if os.path.exists(outputs_dir) is False:
        os.mkdir(outputs_dir)

    # Create folder in outputs for todays date
    todays_date = datetime.datetime.now().strftime("%Y%m%d")
    date_folder = os.path.join(outputs_dir, todays_date)
    if os.path.exists(date_folder) is False:
        os.mkdir(date_folder)

    timestamp = datetime.datetime.now().strftime("ImgGen_%H%M%S")
    return os.path.join(date_folder, timestamp)