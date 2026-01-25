#!/bin/bash

# Install main dependencies
npm install zustand dexie lucide-react class-variance-authority clsx tailwind-merge

# Install Radix UI components for shadcn/ui
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-button @radix-ui/react-card @radix-ui/react-progress @radix-ui/react-toast @radix-ui/react-switch

# Install other UI dependencies
npm install react-confetti framer-motion

# Install PWA dependencies
npm install next-pwa

echo "Dependencies installed successfully!"