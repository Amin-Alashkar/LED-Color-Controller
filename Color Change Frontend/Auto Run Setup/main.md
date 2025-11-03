# Auto Run Setup 

This folder explains how to automatically start both the backend (FastAPI) and frontend (HTTP Server) on Raspberry Pi using `systemd` services.

Initially, auto-start was handled inside `.bashrc`, but that method has several issues:
- Only works when user logs in through `/dev/tty1`
- Does not restart if the process fails
- Hard to debug or check logs

Using `systemd` solves these problems by:
- Starting services automatically at boot
- Restarting on failure
- Logging outputs in `journalctl`
- Running independently of user sessions

Below are separate guides for both the backend and frontend services.
