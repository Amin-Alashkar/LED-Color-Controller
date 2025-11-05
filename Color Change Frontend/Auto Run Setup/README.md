# ⚙️ Auto Run Setup

This folder explains how to automatically start both the **backend (FastAPI + Uvicorn)** and the **frontend (served via `http-server`)** on your Raspberry Pi.

---

## ⚡ `.bashrc` Method (Quick & Temporary)

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

> **Notes**
>
> * Replace `username` and folder names with your actual paths.
> * Use quotes if the folder name contains spaces.
> * Get your home path with:
>
>   ```bash
>   echo $HOME
>   ```
> * Redirect logs if needed:
>
>   ```bash
>   ... --port 8000 > /home/username/uvicorn.log 2>&1 &
>   ```

> **Limitations**
>
> * Runs only on interactive login (`tty1`), not at boot.
> * No process supervision or auto-restart.
> * Not ideal for long-term setups.

For a clean, reliable startup, use **systemd** instead.

---

## 🛠️ `systemd` Method (Recommended)

`systemd` starts your services automatically at boot, restarts them on failure, and provides full control through `systemctl`.

You’ll create two service units:

* **led-backend.service** — runs the FastAPI backend
* **led-frontend.service** — serves the static frontend

---

### 🌐 Frontend Service

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

Check status and logs:

```bash
sudo systemctl status led-frontend.service
sudo journalctl -u led-frontend.service -f
```

---

### 🧠 Backend Service

Create the file:

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

Check status and logs:

```bash
sudo systemctl status led-backend.service
sudo journalctl -u led-backend.service -f
```


> ⚠️ **Remember:** Replace `User=student` and folder names with your actual paths before saving the unit files.

---

## ⚙️ Service Management Commands

Use these to control both services:

| Action                           | Copy Command                                                                                            |
| :------------------------------- | :------------------------------------------------------------------------------------------------------ |
| ▶️ **Start**                     | `bash<br>sudo systemctl start led-backend.service<br>sudo systemctl start led-frontend.service<br>`     |
| ⏹️ **Stop**                      | `bash<br>sudo systemctl stop led-backend.service<br>sudo systemctl stop led-frontend.service<br>`       |
| 🔁 **Restart**                   | `bash<br>sudo systemctl restart led-backend.service<br>sudo systemctl restart led-frontend.service<br>` |
| 🧾 **Status**                    | `bash<br>sudo systemctl status led-backend.service<br>sudo systemctl status led-frontend.service<br>`   |
| 🚫 **Disable (Stop auto-start)** | `bash<br>sudo systemctl disable --now led-backend.service led-frontend.service<br>`                     |


---

## 📝 Summary

* `.bashrc` is fine for testing — **not reliable** for boot-level startup.
* `systemd` is the proper way to:

  * Auto-run at boot
  * Auto-restart on failure
  * Manage via `systemctl`
  * View logs with `journalctl`
* Once configured, your **backend** and **frontend** will both launch automatically every time your Raspberry Pi starts, no manual steps needed.

---
