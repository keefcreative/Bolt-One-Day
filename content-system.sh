#!/bin/bash

# Content System Launcher
# Can be run from anywhere to access the content improvement system

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CONTENT_SCRIPT_DIR="$SCRIPT_DIR/Content Script"

# Check if Content Script directory exists
if [ ! -d "$CONTENT_SCRIPT_DIR" ]; then
    echo -e "${RED}Error: Content Script directory not found at $CONTENT_SCRIPT_DIR${NC}"
    exit 1
fi

# Change to Content Script directory
cd "$CONTENT_SCRIPT_DIR"

# Function to display menu
show_menu() {
    clear
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}     🚀 CONTENT IMPROVEMENT SYSTEM${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${GREEN}Main Options:${NC}"
    echo "  1) Open Visual Dashboard (Browser)"
    echo "  2) Interactive CLI Menu"
    echo "  3) View Current Status"
    echo "  4) Run Full Workflow"
    echo ""
    echo -e "${YELLOW}Quick Actions:${NC}"
    echo "  5) Analyze All Sections"
    echo "  6) Generate Improvements"
    echo "  7) Review Changes"
    echo "  8) Implement Approved"
    echo ""
    echo -e "${BLUE}Utilities:${NC}"
    echo "  9) Show Next Action"
    echo "  10) View History"
    echo "  11) Help"
    echo ""
    echo "  0) Exit"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Function to run npm commands
run_command() {
    echo -e "${GREEN}Running: npm run $1${NC}"
    npm run $1
    echo ""
    echo -e "${YELLOW}Press Enter to continue...${NC}"
    read
}

# Main loop
while true; do
    show_menu
    echo -n "Select option: "
    read choice
    
    case $choice in
        1)
            echo -e "${GREEN}Opening Visual Dashboard...${NC}"
            npm run dashboard
            sleep 2
            ;;
        2)
            npm run content
            ;;
        3)
            run_command "status"
            ;;
        4)
            echo -e "${YELLOW}This will run the complete workflow. Continue? (y/n)${NC}"
            read confirm
            if [ "$confirm" = "y" ]; then
                npm run workflow
            fi
            ;;
        5)
            run_command "analyze:all"
            ;;
        6)
            run_command "improve:pending"
            ;;
        7)
            echo -e "${GREEN}Opening Review Dashboard...${NC}"
            npm run review
            sleep 2
            ;;
        8)
            run_command "implement:approved"
            ;;
        9)
            run_command "next"
            ;;
        10)
            run_command "history"
            ;;
        11)
            run_command "help"
            ;;
        0)
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Please try again.${NC}"
            sleep 2
            ;;
    esac
done