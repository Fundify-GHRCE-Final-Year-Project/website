'use client'

import { useGetUserProjects } from '@/lib/hooks'
import { ProjectCard } from '@/components/project-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Grid3X3, 
  List,
  Loader2,
  AlertCircle,
  Plus,
  FolderOpen,
  TrendingUp
} from 'lucide-react'
import { useState } from 'react'
import { useAtom } from 'jotai'
import { currentUserAtom } from '@/store/global'
import Link from 'next/link'

export default function MyProjectsPage() {
  const { projects, isLoading, error } = useGetUserProjects()
  const [currentUser] = useAtom(currentUserAtom)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredProjects = projects?.filter(project => {
    return project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           project.description.toLowerCase().includes(searchTerm.toLowerCase())
  }) || []

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-semibold">Error Loading My Projects</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {error}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Projects</h1>
            <p className="text-muted-foreground">
              Manage and track the projects you've created.
            </p>
          </div>
          <Link href="/publish">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create New Project</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Project Summary */}
      {currentUser && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <FolderOpen className="h-5 w-5" />
                <span className="text-sm font-medium">Total Projects</span>
              </div>
              <div className="text-2xl font-bold">{filteredProjects.length}</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Active Projects</span>
              </div>
              <div className="text-2xl font-bold">{filteredProjects.filter(p => !p.ended).length}</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Total Funding</span>
              </div>
              <div className="text-2xl font-bold">
                {filteredProjects.reduce((total, project) => total + project.funded, 0).toFixed(2)} ETH
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search my projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Loading my projects...' : `${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading my projects...</span>
          </div>
        </div>
      )}

      {/* Projects Grid/List */}
      {!isLoading && filteredProjects.length > 0 && (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={`${project.owner}-${project.index}`}
              project={project}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No projects found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            {searchTerm 
              ? 'Try adjusting your search to find your projects.'
              : 'You haven\'t created any projects yet. Start building and sharing your ideas with the world!'
            }
          </p>
          {searchTerm && (
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </Button>
          )}
          {!searchTerm && (
            <Link href="/publish">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Project
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}