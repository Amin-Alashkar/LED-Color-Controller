Automatic LED Color Controller on Raspberry Pi

Project Summary:
I built a system that lets me control a strip of LEDs from a web page. The back-end runs on FastAPI (Python) and the front-end is a simple HTML/JS page. I set it up so that when the Raspberry Pi boots, it automatically:
	1.	Starts the FastAPI server on port 8000.
	2.	Starts a simple web server (http-server) for the front-end on port 5501.
	3.	Uses JavaScript’s window.location.hostname so the code automatically finds the Pi’s IP address—no manual IP edits needed.

Below is a child-friendly, step-by-step guide with all commands, example errors, and how to fix them.

⸻

Step-by-Step Installation Guide

1. System Update

First, make sure the Pi’s operating system is up to date:

sudo apt update
sudo apt upgrade -y

	•	sudo apt update fetches the latest package lists.
	•	sudo apt upgrade -y installs new versions of packages.

If you see long output, that is normal. Just wait until it finishes.

⸻

2. Create a Python Virtual Environment

We want all Python packages for this project kept separate from the rest of the system. That is why we make a “virtual environment.”
	1.	Open Terminal and go to the main project folder:

cd ~/pixel_project

	•	If the folder does not exist, create it first:

mkdir -p ~/pixel_project
cd ~/pixel_project


	2.	Create the virtual environment:

python3 -m venv .venv

	•	This makes a folder called .venv inside pixel_project.
	•	The dot (.) at the front hides the folder name in a normal directory listing, but you can still see it with ls -a.

	3.	Activate the virtual environment:

source .venv/bin/activate

	•	Now your prompt (in Terminal) should start with (.venv). That means the environment is on.
	•	Any Python packages you install now go only into this .venv folder.

Common Mistake & Fix:
	•	If you get:

bash: .venv/bin/activate: No such file or directory

It means either you ran the command from the wrong folder, or you didn’t create .venv yet.
	•	Fix: Make sure you are in ~/pixel_project, then run python3 -m venv .venv again, then source .venv/bin/activate.

⸻

3. Install Python Packages (FastAPI and Uvicorn)

Inside the activated virtual environment, install the necessary Python packages:

pip install fastapi uvicorn

	•	fastapi is the web framework that handles HTTP requests.
	•	uvicorn is the server that runs the FastAPI app.

After installing, freeze the requirements to a file. This way, you can always reproduce the same setup later:

pip freeze > requirements.txt

Now requirements.txt will contain lines like:

fastapi==0.95.1
uvicorn==0.22.0

(versions may differ)

⸻

4. Install Node.js and http-server (Front-End Server)

Because VS Code’s “Live Server” cannot run automatically at boot, we use a simple command-line server called http-server.
	1.	Install Node.js and npm (if not already installed):

sudo apt install -y nodejs npm


	2.	Install http-server globally (so you can run it from any folder):

sudo npm install -g http-server


	3.	Verify installation:

http-server -v

If it prints a version number (e.g. v0.12.3), it is installed successfully.

Common Mistake & Fix:
	•	If you see:

bash: http-server: command not found

It means http-server was not installed globally.
	•	Fix: Run sudo npm install -g http-server again.
	•	Then check with http-server -v.

⸻

5. Set Up the JavaScript Front-End (script.js)

Inside your front-end folder (LED-Color-Controller/Color Change Frontend), open the JavaScript file (e.g. script.js or app.js). At the top, replace any hardcoded IPs with this line:

// Dynamically detect the Raspberry Pi’s IP address:
const API_BASE_URL = `http://${window.location.hostname}:8000`;

Why this works:
	•	If you open your browser at http://192.168.1.50:5501, then window.location.hostname becomes "192.168.1.50", so API_BASE_URL is "http://192.168.1.50:8000".
	•	If you move to school and the Pi’s IP changes to 10.220.1.123, and you open http://10.220.1.123:5501, then window.location.hostname is "10.220.1.123". Now API_BASE_URL is "http://10.220.1.123:8000".
	•	This means no manual editing of IP addresses in the code.

After you add that line, make sure all fetch calls and EventSource use API_BASE_URL as the prefix. For example:

// Example of sending a color change:
fetch(`${API_BASE_URL}/color`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ hex_color: "#FF0000" })
});


⸻

6. Create or Modify .bashrc to Auto-Start Servers on Boot

We want the Raspberry Pi to start everything automatically when it turns on, without typing commands manually. We will edit the file ~/.bashrc (that runs for each login) and add our commands in a special block so they run only once at boot, not every time you open a new Terminal.
	1.	Open ~/.bashrc in a text editor:

nano ~/.bashrc


	2.	Scroll to the very end of the file (you can press Ctrl+V or just use the arrow keys).
	3.	Add these lines at the bottom:

# ─── START AUTOMATIC SERVERS AT BOOT ───

if [ "$(tty)" = "/dev/tty1" ]; then
  # 1. Set UTF-8 encoding for Python (if needed)
  export PYTHONIOENCODING=utf-8

  # 2. Go to the main project folder
  cd /home/student/pixel_project

  # 3. Activate the Python virtual environment
  source .venv/bin/activate

  # 4. Start FastAPI with uvicorn in the background
  uvicorn server:app --host 0.0.0.0 --port 8000 &

  # 5. Wait 2 seconds to let the server start
  sleep 2

  # 6. Go to the front-end folder
  cd "LED-Color-Controller/Color Change Frontend"

  # 7. Start http-server on port 5501 in the background
  http-server -c-1 -p 5501 &
fi

# ───── END AUTOMATIC SERVERS ─────


	4.	Save and exit:
	•	Press Ctrl + O to write the file (it will show File Name to Write: ~/.bashrc), then press Enter.
	•	Press Ctrl + X to exit the editor.

Explanation of each step in .bashrc:
	1.	if [ "$(tty)" = "/dev/tty1" ]; then … fi
	•	$(tty) returns the current Terminal device.
	•	/dev/tty1 is the physical screen (the one you see when Pi boots up).
	•	This block ensures the commands inside run once on the main console, not on every new SSH/Terminal.
	2.	export PYTHONIOENCODING=utf-8
	•	Ensures Python prints text in UTF-8, which helps with any Arabic text if you ever need it.
	3.	cd /home/student/pixel_project
	•	Moves to the folder where server.py and .venv live.
	4.	source .venv/bin/activate
	•	Activates the virtual environment so that uvicorn and fastapi are available.
	5.	uvicorn server:app --host 0.0.0.0 --port 8000 &
	•	server:app means “run the file server.py and use the app object inside it.”
	•	--host 0.0.0.0 allows any device on the network to connect.
	•	--port 8000 sets the listening port to 8000.
	•	The & at the end means “run it in the background, so the script continues immediately.”
	6.	sleep 2
	•	Waits two seconds to let uvicorn fully start before moving on.
	7.	cd "LED-Color-Controller/Color Change Frontend"
	•	Moves to the front-end folder (note the quotes because there is a space in the folder name).
	8.	http-server -c-1 -p 5501 &
	•	Starts a static file server serving the current folder on port 5501.
	•	-c-1 disables caching so you see immediate changes.
	•	The & runs it in the background.

⸻

7. Testing and Rebooting
	1.	Save all your code changes (JavaScript, Python, and .bashrc).
	2.	Reboot the Raspberry Pi:

sudo reboot


	3.	Wait a minute for it to finish booting.
	4.	On any other computer or phone in the same network, open a web browser and type:

http://<raspberry_pi_ip>:5501

	•	You need to know your Pi’s IP address. You can find it before reboot by running:

hostname -I


	•	Suppose it says 192.168.1.50. Then you open http://192.168.1.50:5501.

	5.	You should see the front-end page load immediately. Click buttons to control the LEDs. The JavaScript will send requests automatically to http://192.168.1.50:8000/... because of the dynamic API_BASE_URL line.

⸻

Troubleshooting Common Errors

Below are examples of errors you might see, and how to fix them.

⸻

Error A: Virtual Environment Not Found

bash: .venv/bin/activate: No such file or directory

Meaning: You ran source .venv/bin/activate in the wrong folder, or you never created .venv.

How to fix:
	1.	Make sure you are in the ~/pixel_project folder:

cd ~/pixel_project


	2.	If .venv does not exist, create it:

python3 -m venv .venv


	3.	Activate it:

source .venv/bin/activate


	4.	You should now see (.venv) at the start of your prompt.

⸻

Error B: uvicorn: Command Not Found

bash: uvicorn: command not found

Meaning: You tried uvicorn server:app … without installing uvicorn, or the virtual environment was not active.

How to fix:
	1.	Activate the virtual environment first:

cd ~/pixel_project
source .venv/bin/activate


	2.	Install the packages:

pip install fastapi uvicorn


	3.	Test again:

uvicorn server:app --host 0.0.0.0 --port 8000


	4.	You should see output like:

INFO:     Started server process [1234]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)



⸻

Error C: Address Already in Use

ERROR:    [Errno 98] address already in use

Meaning: Port 8000 is already occupied by another process.

How to fix:
	1.	Find which process uses port 8000:

sudo lsof -i :8000

	•	If it shows a line with uvicorn, note its PID (e.g. 1494).

	2.	Kill that process:

sudo kill 1494

Or kill all processes on that port:

sudo fuser -k 8000/tcp


	3.	Run uvicorn again:

uvicorn server:app --host 0.0.0.0 --port 8000


	4.	No more “address already in use.”

⸻

Error D: http-server: Command Not Found

bash: http-server: command not found

Meaning: You did not install http-server, or you tried to run it inside the Python virtual environment (where npm’s global binaries might not be in PATH).

How to fix:
	1.	Exit the virtual environment (type deactivate if you see (.venv) in your prompt).
	2.	Install globally:

sudo npm install -g http-server


	3.	Verify:

http-server -v


	4.	Now run http-server from anywhere (even inside the venv):

cd ~/pixel_project/LED-Color-Controller/Color\ Change\ Frontend
http-server -c-1 -p 5501



⸻

Error E: cd: Too Many Arguments

bash: cd: too many arguments

Meaning: The folder name has a space, like Color Change Frontend. The shell thinks you meant to run cd Color and then a second command Change and Frontend.

How to fix:
	•	Surround the path with double quotes:

cd "LED-Color-Controller/Color Change Frontend"


	•	Or escape the spaces:

cd LED-Color-Controller/Color\ Change\ Frontend



⸻

Folder and File Layout Recap

Just to be extra clear, here is an example of what your pixel_project folder might look like, shown up to two levels deep:

pixel_project/
│
├── .venv/                             # Python virtual environment
│   ├── bin/
│   ├── lib/
│   └── ...
│
├── requirements.txt                   # FastAPI & uvicorn listed here
├── server.py                          # FastAPI app code
│
└── LED-Color-Controller/
    └── Color Change Frontend/
        ├── index.html                 # Main HTML page
        ├── script.js                  # JavaScript (with API_BASE_URL line)
        └── style.css                  # Styling

	•	.venv/ must be at /home/student/pixel_project/.venv/.
	•	server.py must be at /home/student/pixel_project/server.py.
	•	Front-End Folder must be exactly /home/student/pixel_project/LED-Color-Controller/Color Change Frontend/.

⸻

Final Test: Reboot and Verify
	1.	Reboot the Pi:

sudo reboot


	2.	Wait a minute for the Pi to finish booting.
	3.	On your laptop or phone, open a browser and type:

http://<raspberry_pi_ip>:5501

	•	Replace <raspberry_pi_ip> with the actual IP address of your Pi (e.g., 192.168.1.50).

	4.	You should immediately see your LED controller web page.
	5.	Click any button or choose a color—your LEDs should respond.

⸻

The End

Now, your Raspberry Pi:
	•	Updates itself automatically at boot.
	•	Activates the Python environment.
	•	Runs the FastAPI server on port 8000.
	•	Runs the front-end on port 5501.
	•	Uses a smart JavaScript line so it always finds the right IP:

const API_BASE_URL = `http://${window.location.hostname}:8000`;



You never have to type those commands by hand again. Everything is automatic and child-proof. 🎉

If any new error appears, follow the “Troubleshooting Common Errors” section above, and you’ll fix it quickly. Enjoy controlling your LEDs! 😊
