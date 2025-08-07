'use client'

import Link from 'next/link'
import { useAtom } from 'jotai'
import { 
  isUserConnectedAtom, 
  userWalletAtom, 
  currentUserAtom,
  hasInvestmentsAtom,
  hasProjectsAtom
} from '@/store/global'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Wallet, 
  Menu, 
  X, 
  User, 
  FolderOpen, 
  TrendingUp, 
  Plus,
  LogOut
} from 'lucide-react'
import { useState } from 'react'
import { setWalletToCache, clearWalletCache, clearUserCache, setUserToCache } from '@/lib/browserCache'

export function Header() {
  const [isConnected, setIsConnected] = useAtom(isUserConnectedAtom)
  const [wallet, setWallet] = useAtom(userWalletAtom)
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom)
  const [hasInvestments] = useAtom(hasInvestmentsAtom)
  const [hasProjects] = useAtom(hasProjectsAtom)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const connectWallet = async () => {
    try {
      // Simulate wallet connection
      const mockWallet = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
      setWallet(mockWallet)
      setIsConnected(true)
      setWalletToCache(mockWallet)
      
      // Generate and set user data for the connected wallet
      const mockUser = {
        wallet: mockWallet,
        name: 'John Doe',
        country: 'United States',
        investments: [
          {
            projectOwner: '0x1234567890123456789012345678901234567890',
            index: 1,
            amount: 2.5,
            defunded: 0
          }
        ],
        projectCount: 3,
        role: 'Software Developer',
        skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Blockchain'],
        experiences: [
          {
            role: 'Senior Developer',
            company: 'Tech Corp',
            duration: '2020-2023'
          },
          {
            role: 'Full Stack Developer',
            company: 'Startup Inc',
            duration: '2018-2020'
          }
        ],
        linkedin: 'https://linkedin.com/in/johndoe',
        x: 'https://x.com/johndoe',
        github: 'https://github.com/johndoe'
      }
      
      setCurrentUser(mockUser)
      setUserToCache(mockUser)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const disconnectWallet = () => {
    setWallet(null)
    setIsConnected(false)
    setCurrentUser(null)
    clearWalletCache()
    clearUserCache()
    setIsMobileMenuOpen(false)
  }

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold gradient-text">Fundify</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/projects" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Projects
            </Link>
            
            {hasInvestments && (
              <Link 
                href="/invested-projects" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Invested Projects
              </Link>
            )}
            
            {hasProjects && (
              <Link 
                href="/my-projects" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                My Projects
              </Link>
            )}
            
            <Link 
              href="/publish" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Publish Project
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Wallet className="h-3 w-3" />
                  <span>{formatWalletAddress(wallet!)}</span>
                </Badge>
                
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={disconnectWallet}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Disconnect</span>
                </Button>
              </div>
            ) : (
              <Button onClick={connectWallet} className="flex items-center space-x-2">
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/projects" 
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <FolderOpen className="h-4 w-4" />
                  <span>Projects</span>
                </div>
              </Link>
              
              {hasInvestments && (
                <Link 
                  href="/invested-projects" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Invested Projects</span>
                  </div>
                </Link>
              )}
              
              {hasProjects && (
                <Link 
                  href="/my-projects" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>My Projects</span>
                  </div>
                </Link>
              )}
              
              <Link 
                href="/publish" 
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Publish Project</span>
                </div>
              </Link>

              {isConnected ? (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Wallet className="h-4 w-4" />
                    <span>{formatWalletAddress(wallet!)}</span>
                  </div>
                  
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={disconnectWallet}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button onClick={connectWallet} className="w-full justify-start">
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 