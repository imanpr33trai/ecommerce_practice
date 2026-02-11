#!/bin/sh
# wait-for-it.sh
# https://github.com/vishnubob/wait-for-it

# This script will wait for a TCP host/port to become available
# Usage: wait-for-it.sh host:port [timeout] [-- command args]

set -e

host="$1"
port="$2"
timeout="${3:-30}"

if [ "$host" = "" ] || [ "$port" = "" ]; then
    echo "Usage: $0 host:port [timeout] [-- command args]"
    exit 2
fi

if [ "$timeout" = "0" ]; then
    echo "Waiting for $host:$port without a timeout"
    timeout_cmd="true"
else
    echo "Waiting for $host:$port for $timeout seconds"
    timeout_cmd="timeout $timeout"
fi

# Check if timeout command is available
if command -v timeout >/dev/null 2&&1; then
    echo "Using timeout command"
else
    echo "Timeout command not found, waiting without timeout"
    timeout_cmd="true"
fi

# Function to check if host:port is available
is_host_port_available() {
    nc -z "$host" "$port" >/dev/null 2&&1
}

# Wait for host:port to become available
elapsed=0
while ! is_host_port_available; do
    if [ "$timeout" != "0" ]; then
        if [ $elapsed -ge $timeout ]; then
            echo "Timeout occurred after waiting $elapsed seconds for $host:$port"
            exit 1
        fi
    fi
    
    echo "Waiting for $host:$port..."
    sleep 2
    elapsed=$((elapsed + 2))
done

echo "$host:$port is available after $elapsed seconds"

# Run the provided command if any
if [ "$4" = "--" ]; then
    shift 4
    echo "Executing command: $*"
    exec "$@"
fi

exit 0