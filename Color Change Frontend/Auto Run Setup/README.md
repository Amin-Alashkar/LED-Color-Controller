# Auto Run Setup

This folder explains how to automatically start both the backend (FastAPI + Uvicorn) and the frontend (static files served with `http-server`) for this project.

---

## .bashrc (quick / temporary method)

You can use `~/.bashrc` to auto-start processes when you log in to the Pi on `tty1`.
Open the file in a terminal:

```bash
nano ~/.bashrc
```

Scroll to the end and add the block below (example):

```bash
if [ "$(tty)" = "/dev/tty1" ]; then
  export PYTHONIOENCODING=utf-8

  # backend: activate venv and start uvicorn
  cd /home/username/project_folder
  source .venv/bin/activate
  /home/username/project_folder/.venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8000 &

  sleep 2

  # frontend: change to frontend folder and start http-server
  cd "/home/username/project_folder/frontend_folder"
  /usr/local/bin/http-server -c-1 -p 5501 &
fi

```

Note:

Replace username and folder names (project_folder, frontend_folder) with your actual paths.

You can find your correct home directory with `echo $HOME`


Use quotes around folder names that contain spaces.
Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).
Now, whenever someone logs in on `tty1`, the backend and frontend processes will be started.

### What to add / notes for `.bashrc`

* Use absolute paths for everything (no relative paths). That prevents surprises when running from different locations.
* Prefer calling the venv `python` directly (as shown) instead of `source` + calling bare `uvicorn`, because `systemd` will not run `.bashrc`. Still the example above uses `source` to show intent.
* Add logging redirection if you want to capture stdout/stderr:

  ```bash
  /home/student/pixel_project/.venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8000 > /home/student/uvicorn.log 2>&1 &
  /usr/local/bin/http-server -c-1 -p 5501 > /home/student/http-server.log 2>&1 &
  ```
* If your folder names contain spaces, either escape them (`Color\ Change\ Frontend`) or wrap the path in quotes as shown.
* This method is OK for quick testing or experiments, but it is not recommended for a reliable production-like setup.

### Why `.bashrc` is not practical / recommended

* It only runs when a user logs in interactively (tty1), not automatically at boot.
* No built-in supervision: if a process crashes it will not be automatically restarted.
* Hard to manage: no easy `status`/`restart` commands, no centralized logs.
* Running services from `~/.bashrc` can lead to duplicate processes, orphaned background jobs, and messy troubleshooting.

For a stable, maintainable setup use `systemd` (instructions below).

---

## systemd (recommended)

`systemd` is the init/system manager on most Linux distributions. It is the correct tool to run and manage long-lived services because it:

* starts services at boot (before any user logs in),
* restarts them on failure,
* provides centralized logs via `journalctl`,
* lets you `start`, `stop`, `restart`, `enable`, and check `status` for each service.

You will create two service units:

* `led-frontend.service` — serves the frontend
* `led-backend.service` — runs the backend

---

### Frontend service: `led-frontend.service`

Open a new unit file:

```bash
sudo nano /etc/systemd/system/led-frontend.service
```

Paste this content (edit the paths if different on your system):

```ini
[Unit]
Description=LED Color Controller Frontend (http-server)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=student
WorkingDirectory=/home/student/pixel_project/LED-Color-Controller/Color\ Change\ Frontend
ExecStart=/usr/local/bin/http-server -c-1 -p 5501
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Notes:

* If your path contains spaces you can escape them (`\ `) as shown, or rename the folder to remove spaces.
* `ExecStart` uses the full path to `http-server`. Confirm with `which http-server` or `ls /usr/local/bin/http-server`.
* `-c-1` disables caching (useful while developing).

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now led-frontend.service
```

Check status and logs:

```bash
sudo systemctl status led-frontend.service
sudo journalctl -u led-frontend.service -f
```

---

### Backend service: `led-backend.service`

Open a new unit file:

```bash
sudo nano /etc/systemd/system/led-backend.service
```

Paste this content (edit paths as needed):

```ini
[Unit]
Description=LED Color Controller Backend (uvicorn)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=student
WorkingDirectory=/home/student/pixel_project
Environment=PYTHONIOENCODING=utf-8
ExecStart=/home/student/pixel_project/.venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8000
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now led-backend.service
```

Check status and logs:

```bash
sudo systemctl status led-backend.service
sudo journalctl -u led-backend.service -f
```

---

## Extra tips

* If a unit fails with `CHDIR` or similar, check `WorkingDirectory` path carefully. Use `ls /path/to/dir` to validate.
* If `http://<pi-ip>:5501/` is unreachable, verify the frontend service is `active (running)` and that no firewall blocks the port (`sudo ufw status`).
* For production-style setup and to serve the frontend on port 80 (so users don’t need to type a port), keep `http-server` on 5501 and use a reverse proxy like `nginx` or `caddy` to forward `:80` → `127.0.0.1:5501`.
* To stop auto-start and remove the enabled state:

  ```bash
  sudo systemctl disable --now led-backend.service led-frontend.service
  ```
* To manually test the commands before creating service units, run them in a shell from the correct directories (this helps spot path issues).

---

## Summary (what I changed / why)

* Temporary `.bashrc` auto-start was used initially for quick testing.
* Replaced with proper `systemd` services to:

  * run at boot without interactive login
  * auto-restart on failure
  * centralize logs via `journalctl`
  * manage service lifecycle with `systemctl` commands

Put this README.md inside your `Auto Run Setup (systemd)/` folder so other developers can quickly understand how the auto-start works and how to manage the services.
