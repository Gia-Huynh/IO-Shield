# save_timestamp.py
from datetime import datetime

timestamp_file = "0 timestamps.txt"

# Get current timestamp
now = datetime.now().isoformat()

# Append to file
with open(timestamp_file, "a") as f:
    f.write(now + "\n")

print(f"Saved timestamp: {now}")
