#!/bin/bash

# Setup script for Korean TOPIK Learning App
# This script will set up the entire development environment

set -e  # Exit on error

echo "🚀 Korean TOPIK Learning App - Setup Script"
echo "==========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    print_info "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 20.x or higher."
        exit 1
    fi
    print_success "Node.js $(node --version) found"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    print_success "npm $(npm --version) found"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. You'll need it to run PostgreSQL."
        read -p "Continue without Docker? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        print_success "Docker $(docker --version | cut -d ' ' -f3) found"
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_warning "Docker Compose is not installed."
    else
        print_success "Docker Compose found"
    fi
    
    echo ""
}

# Setup environment file
setup_env() {
    print_info "Setting up environment variables..."
    
    if [ -f .env ]; then
        print_warning ".env file already exists. Skipping..."
    else
        cp .env.example .env
        print_success "Created .env file from .env.example"
        print_info "Please review and update .env file with your settings"
    fi
    
    echo ""
}

# Install dependencies
install_dependencies() {
    print_info "Installing npm dependencies..."
    
    npm install
    
    print_success "Dependencies installed successfully"
    echo ""
}

# Setup Docker
setup_docker() {
    print_info "Setting up Docker containers..."
    
    if command -v docker &> /dev/null; then
        # Check if containers are already running
        if docker ps | grep -q topik-postgres; then
            print_warning "PostgreSQL container is already running"
        else
            print_info "Starting PostgreSQL container..."
            npm run docker:up
            
            # Wait for PostgreSQL to be ready
            print_info "Waiting for PostgreSQL to be ready..."
            sleep 5
            
            print_success "Docker containers started successfully"
        fi
    else
        print_warning "Docker not available. Skipping container setup."
        print_info "You'll need to set up PostgreSQL manually."
    fi
    
    echo ""
}

# Setup Prisma
setup_prisma() {
    print_info "Setting up Prisma..."
    
    # Generate Prisma Client
    print_info "Generating Prisma Client..."
    npm run db:generate
    print_success "Prisma Client generated"
    
    # Run migrations
    print_info "Running database migrations..."
    npm run db:migrate
    print_success "Migrations completed"
    
    # Seed database
    print_info "Seeding database with initial data..."
    npm run db:seed
    print_success "Database seeded successfully"
    
    echo ""
}

# Display next steps
show_next_steps() {
    echo ""
    echo "=========================================="
    print_success "Setup completed successfully!"
    echo "=========================================="
    echo ""
    echo "📝 Next steps:"
    echo ""
    echo "1. Review and update .env file if needed"
    echo "2. Start the development server:"
    echo "   ${BLUE}npm run dev${NC}"
    echo ""
    echo "3. Open your browser and visit:"
    echo "   ${BLUE}http://localhost:3000${NC}"
    echo ""
    echo "4. (Optional) Open Prisma Studio to manage data:"
    echo "   ${BLUE}npm run db:studio${NC}"
    echo ""
    echo "5. (Optional) Access pgAdmin:"
    echo "   ${BLUE}http://localhost:5050${NC}"
    echo "   Email: admin@topik.local"
    echo "   Password: admin123"
    echo ""
    echo "📚 Useful commands:"
    echo "   ${BLUE}npm run docker:up${NC}      - Start Docker containers"
    echo "   ${BLUE}npm run docker:down${NC}    - Stop Docker containers"
    echo "   ${BLUE}npm run docker:logs${NC}    - View container logs"
    echo "   ${BLUE}npm run db:studio${NC}      - Open Prisma Studio"
    echo "   ${BLUE}npm run db:seed${NC}        - Seed database"
    echo "   ${BLUE}npm run dev${NC}            - Start dev server"
    echo ""
    echo "📖 Documentation:"
    echo "   See DEPLOYMENT.md for detailed documentation"
    echo ""
}

# Main setup flow
main() {
    check_requirements
    setup_env
    install_dependencies
    setup_docker
    
    # Only setup Prisma if Docker is available or user confirms
    if command -v docker &> /dev/null || [ -f .env ]; then
        setup_prisma
    else
        print_warning "Skipping Prisma setup. Please configure database connection first."
    fi
    
    show_next_steps
}

# Run main function
main
