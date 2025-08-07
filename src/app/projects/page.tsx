'use client'

import { useGetAllProjects } from '@/lib/hooks'
import { ProjectCard } from '@/components/project-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { useState } from 'react'
import { Project } from '@/types/global'

export default function ProjectsPage() {
  const { projects, isLoading, error } = useGetAllProjects()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'funded' | 'ended'>('all')

  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && !project.ended && project.funded < project.goal) ||
                         (statusFilter === 'funded' && project.funded >= project.goal) ||
                         (statusFilter === 'ended' && project.ended)
    
    return matchesSearch && matchesStatus
  }) || []

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-semibold">Error Loading Projects</h2>
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
        <h1 className="text-3xl font-bold mb-2">Discover Projects</h1>
        <p className="text-muted-foreground">
          Explore innovative projects and support creators with cryptocurrency funding.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
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

        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All Projects
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === 'funded' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('funded')}
          >
            Funded
          </Button>
          <Button
            variant={statusFilter === 'ended' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('ended')}
          >
            Ended
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Loading projects...' : `${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading projects...</span>
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
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No projects found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters to find more projects.'
              : 'There are no projects available at the moment. Check back later!'
            }
          </p>
          {(searchTerm || statusFilter !== 'all') && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
} 