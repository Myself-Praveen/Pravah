import subprocess

script = """#!/bin/bash
set -e
apt-get update -y
apt-get install -y postgresql redis-server
# Set postgres port to 5433 so it doesn't conflict with Windows 5432
CONF=$(ls /etc/postgresql/*/main/postgresql.conf | head -n 1)
if [ -f "$CONF" ]; then
    sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$CONF"
    sed -i "s/port = 5432/port = 5433/" "$CONF"
fi
HBA=$(ls /etc/postgresql/*/main/pg_hba.conf | head -n 1)
if [ -f "$HBA" ]; then
    echo "host all all 0.0.0.0/0 trust" >> "$HBA"
    echo "host all all ::/0 trust" >> "$HBA"
fi
service postgresql restart
service redis-server restart
sudo -u postgres psql -p 5433 -c "CREATE USER pravah WITH PASSWORD 'pravah' SUPERUSER;" || true
sudo -u postgres psql -p 5433 -c "CREATE DATABASE pravah_db OWNER pravah;" || true
echo "SERVICES_INITIALIZED_SUCCESSFULLY"
"""

with open("wsl_setup.sh", "w", encoding="utf-8", newline="\n") as f:
    f.write(script)

res = subprocess.run(["wsl", "-u", "root", "-d", "Ubuntu", "bash", "/mnt/c/Users/prave/OneDrive/Desktop/Pravah/wsl_setup.sh"], capture_output=True, text=True)
print("STDOUT:", res.stdout[-500:])
print("STDERR:", res.stderr[-500:])
print("CODE:", res.returncode)
