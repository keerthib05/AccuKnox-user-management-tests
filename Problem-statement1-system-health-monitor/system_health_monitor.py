import psutil
import logging
from datetime import datetime
from colorama import init, Fore, Style

# Initialize colorama
init(autoreset=True)

# ------------- CONFIGURATION ------------------

CPU_THRESHOLD = 80
MEMORY_THRESHOLD = 80
DISK_THRESHOLD = 90
LOG_FILE = "logs/system_health.log"

# ------------- LOGGING SETUP ------------------

logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# ------------- ALERT FUNCTION ------------------

def alert(level, message):
    color = {
        'INFO': Fore.GREEN,
        'WARNING': Fore.YELLOW,
        'CRITICAL': Fore.RED
    }.get(level, Fore.WHITE)

    print(f"{color}[{level}] {message}{Style.RESET_ALL}")
    if level == "CRITICAL":
        logging.warning(message)
    else:
        logging.info(message)

# ------------- METRIC CHECKS ------------------

def check_cpu():
    cpu = psutil.cpu_percent(interval=1)
    if cpu > CPU_THRESHOLD:
        alert("CRITICAL", f"High CPU usage: {cpu}%")
    else:
        alert("INFO", f"CPU usage is normal: {cpu}%")
    return cpu

def check_memory():
    mem = psutil.virtual_memory().percent
    if mem > MEMORY_THRESHOLD:
        alert("CRITICAL", f"High Memory usage: {mem}%")
    else:
        alert("INFO", f"Memory usage is normal: {mem}%")
    return mem

def check_disk():
    disk = psutil.disk_usage('/').percent
    if disk > DISK_THRESHOLD:
        alert("CRITICAL", f"High Disk usage: {disk}%")
    else:
        alert("INFO", f"Disk usage is normal: {disk}%")
    return disk

def check_processes(n=5):
    process_list = []
    for proc in psutil.process_iter(['pid', 'name', 'memory_percent']):
        try:
            process_list.append(proc.info)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    top_processes = sorted(process_list, key=lambda p: p['memory_percent'], reverse=True)[:n]
    print(Fore.CYAN + "\nTop Memory Consuming Processes:" + Style.RESET_ALL)
    for proc in top_processes:
        print(f"PID: {proc['pid']}, Name: {proc['name']}, Memory: {proc['memory_percent']:.2f}%")
    return top_processes

# ------------- MAIN MONITOR FUNCTION ------------------

def run_monitor():
    print(Fore.BLUE + "\n====== System Health Monitor ======\n" + Style.RESET_ALL)
    check_cpu()
    check_memory()
    check_disk()
    check_processes()
    print(Fore.BLUE + "\n===================================\n" + Style.RESET_ALL)

# ------------- ENTRY POINT ------------------

if __name__ == "__main__":
    run_monitor()
