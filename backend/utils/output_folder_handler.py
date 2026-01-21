import datetime
import os

def get_save_location():
    if os.path.exists("outputs") is False:
        os.mkdir("outputs")

    # Create folder in outputs for todays date
    todays_date = datetime.datetime.now().strftime("%Y%m%d")
    date_folder = os.path.join("outputs", todays_date)
    if os.path.exists(date_folder) is False:
        os.mkdir(date_folder)

    timestamp = datetime.datetime.now().strftime("ImgGen_%H%M%S")
    return os.path.join(date_folder, timestamp)