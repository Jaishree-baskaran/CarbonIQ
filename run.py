"""
CarbonIQ — Master Launcher
===========================
Run everything with ONE command:

    python run.py

This starts:
  1. Flask backend  → http://localhost:5000  (ML API)
  2. Streamlit app  → http://localhost:8501  (Frontend)

Press Ctrl+C to stop both.
"""

import subprocess
import sys
import time
import threading
import os
import signal

BASE = os.path.dirname(os.path.abspath(__file__))

BACKEND_CMD  = [sys.executable, os.path.join(BASE, "backend.py")]
FRONTEND_CMD = [sys.executable, "-m", "streamlit", "run",
                os.path.join(BASE, "app.py"),
                "--server.port", "8501",
                "--server.headless", "true"]

processes = []

def stream_output(proc, label):
    for line in iter(proc.stdout.readline, b""):
        print(f"[{label}] {line.decode(errors='replace').rstrip()}")

def shutdown(sig=None, frame=None):
    print("\nShutting down CarbonIQ...")
    for p in processes:
        try:
            p.terminate()
        except Exception:
            pass
    sys.exit(0)

signal.signal(signal.SIGINT,  shutdown)
signal.signal(signal.SIGTERM, shutdown)

def launch():
    print("=" * 52)
    print("  CarbonIQ — starting up")
    print("=" * 52)

    # Start Flask backend
    backend = subprocess.Popen(
        BACKEND_CMD,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        cwd=BASE
    )
    processes.append(backend)
    threading.Thread(target=stream_output, args=(backend, "BACKEND"), daemon=True).start()
    print("[LAUNCHER] Flask backend starting on http://localhost:5000")

    # Wait for backend to be ready
    time.sleep(2)

    # Start Streamlit frontend
    frontend = subprocess.Popen(
        FRONTEND_CMD,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        cwd=BASE
    )
    processes.append(frontend)
    threading.Thread(target=stream_output, args=(frontend, "FRONTEND"), daemon=True).start()
    print("[LAUNCHER] Streamlit frontend starting on http://localhost:8501")
    print("[LAUNCHER] Opening: http://localhost:8501")
    print("=" * 52)
    print("  Press Ctrl+C to stop everything")
    print("=" * 52)

    # Open browser after short delay
    time.sleep(3)
    try:
        import webbrowser
        webbrowser.open("http://localhost:8501")
    except Exception:
        pass

    # Keep alive — monitor both processes
    while True:
        time.sleep(1)
        if backend.poll() is not None:
            print("[LAUNCHER] Backend stopped unexpectedly. Shutting down.")
            shutdown()
        if frontend.poll() is not None:
            print("[LAUNCHER] Frontend stopped unexpectedly. Shutting down.")
            shutdown()

if __name__ == "__main__":
    launch()