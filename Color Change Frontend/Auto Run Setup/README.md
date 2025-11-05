# Auto Run Setup

This folder explains how to automatically start both the **backend (FastAPI + Uvicorn)** and **frontend (static files served via `http-server`)** on your Raspberry Pi.

---

## `.bashrc` Method (Quick & Temporary)

To quickly auto-start the project when logging into `tty1`, edit your `~/.bashrc`:

```bash
nano ~/.bashrc
```

Add this block at the end:

```bash
if [ "$(tty)" = "/dev/tty1" ]; then
  export PYTHONIOENCODING=utf-8

  # backend
  cd /home/username/project_folder
  source .venv/bin/activate
  /home/username/project_folder/.venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8000 &

  sleep 2

  # frontend
  cd "/home/username/project_folder/frontend_folder"
  /usr/local/bin/http-server -c-1 -p 5501 &
fi
```

**Notes**

* Replace `username` and folder names with your actual paths.
* Use quotes if the folder name contains spaces.
* Get your home path with:

  ```bash
  echo $HOME
  ```
* Logs can be redirected, e.g.:

  ```bash
  ... --port 8000 > /home/username/uvicorn.log 2>&1 &
  ```

**Limitations**

* Runs only on interactive login (`tty1`), not at boot.
* No supervision or automatic restarts.
* Not suitable for long-term or production use.

For a stable setup, use `systemd`.

---

## `systemd` Method (Recommended)

`systemd` automatically runs your services at boot, restarts them if they fail, and provides full control via `systemctl`.

You’ll create two units:

* **led-backend.service** — runs the FastAPI backend
* **led-frontend.service** — serves the frontend

---

### Frontend Service

Create the file:

```bash
sudo nano /etc/systemd/system/led-frontend.service
```

Paste:

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

Then run:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now led-frontend.service
```

Check status:

```bash
sudo systemctl status led-frontend.service
sudo journalctl -u led-frontend.service -f
```

---

### Backend Service

Create:

```bash
sudo nano /etc/systemd/system/led-backend.service
```

Paste:

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

Check status:

```bash
sudo systemctl status led-backend.service
sudo journalctl -u led-backend.service -f
```

---

## Service Management Commands

| Action                        | Command                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------- |
| **Start**                     | ```bash sudo systemctl start led-backend.service`<br>`sudo systemctl start led-frontend.service```     |
| **Stop**                      | `sudo systemctl stop led-backend.service`<br>`sudo systemctl stop led-frontend.service`       |
| **Restart**                   | `sudo systemctl restart led-backend.service`<br>`sudo systemctl restart led-frontend.service` |
| **Status**                    | `sudo systemctl status led-backend.service`<br>`sudo systemctl status led-frontend.service`   |
| **Disable (stop auto-start)** | `sudo systemctl disable --now led-backend.service led-frontend.service`                       |

---

## Notes

* Both services will run automatically at every boot — no manual login needed.
* Use `journalctl -u <service>` for logs.
* If a service fails to start, check the `WorkingDirectory` and `ExecStart` paths.
* For production, keep the frontend on port `5501` and use a reverse proxy (e.g. Nginx or Caddy) to map it to port `80`.

---




