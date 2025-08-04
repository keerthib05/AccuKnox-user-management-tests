import re
from collections import Counter

LOG_FILE = "access.log"

log_pattern = re.compile(
    r'(?P<ip>\S+) \S+ \S+ \[(?P<time>[^\]]+)\] "(?P<method>\S+) (?P<url>\S+)(?: \S+)?" (?P<status>\d{3}) \S+'
)

status_404_count = 0
url_counter = Counter()
ip_counter = Counter()

with open(LOG_FILE, "r") as file:
    for line in file:
        match = log_pattern.match(line)
        if match:
            ip = match.group("ip")
            url = match.group("url")
            status = match.group("status")

            if status == "404":
                status_404_count += 1

            url_counter[url] += 1
            ip_counter[ip] += 1

print("\n=== Web Server Log Analysis Report ===")
print(f"Total 404 Errors: {status_404_count}")

print("\nTop 5 Requested Pages:")
for url, count in url_counter.most_common(5):
    print(f"{url}: {count} requests")

print("\nTop 5 IP Addresses by Requests:")
for ip, count in ip_counter.most_common(5):
    print(f"{ip}: {count} requests")
