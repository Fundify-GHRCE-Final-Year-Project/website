import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { 
  currentUserAtom, 
  allProjectsAtom, 
  userProjectsAtom, 
  investedProjectsAtom, 
  selectedProjectAtom,
  isLoadingAtom,
  errorMessageAtom,
  successMessageAtom,
  isUserConnectedAtom,
  userWalletAtom
} from '@/store/global';
import { 
  getUserFromCache, 
  setUserToCache, 
  getProjectsFromCache, 
  setProjectsToCache,
  getUserProjectsFromCache,
  setUserProjectsToCache,
  getInvestedProjectsFromCache,
  setInvestedProjectsToCache,
  getSelectedProjectFromCache,
  setSelectedProjectToCache
} from '@/lib/browserCache';
import { User, Project } from '@/types/global';

// Dummy data generators
export const generateDummyUser = (wallet: string): User => ({
  wallet,
  name: 'John Doe',
  country: 'United States',
  investments: [
    {
      projectOwner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      index: 1,
      amount: 2.5,
      defunded: 0.5
    },
    {
      projectOwner: '0x1234567890123456789012345678901234567890',
      index: 2,
      amount: 1.8,
      defunded: 0
    }
  ],
  projectCount: 3,
  role: 'Software Developer',
  skills: ['React', 'TypeScript', 'Node.js', 'Solidity', 'Web3'],
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
});

const generateDummyProjects = (): Project[] => [
  {
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    members: ['0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'],
    index: 1,
    goal: 50,
    milestones: 3,
    funded: 35,
    released: 15,
    defunded: 5,
    ended: false,
    title: 'DeFi Lending Platform',
    description: 'A decentralized lending platform built on Ethereum with smart contract automation.'
  },
  {
    owner: '0x1234567890123456789012345678901234567890',
    members: ['0x1234567890123456789012345678901234567890'],
    index: 2,
    goal: 25,
    milestones: 2,
    funded: 25,
    released: 12.5,
    defunded: 0,
    ended: false,
    title: 'NFT Marketplace',
    description: 'A comprehensive NFT marketplace with advanced trading features and analytics.'
  },
  {
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    members: ['0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'],
    index: 3,
    goal: 100,
    milestones: 4,
    funded: 75,
    released: 25,
    defunded: 10,
    ended: false,
    title: 'DAO Governance Platform',
    description: 'A decentralized autonomous organization platform with voting mechanisms and proposal management.'
  }
];

/**
 * Hook to get current user data
 */
export const useGetCurrentUser = () => {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [error, setError] = useAtom(errorMessageAtom);
  const [isConnected] = useAtom(isUserConnectedAtom);
  const [wallet] = useAtom(userWalletAtom);

  const fetchUser = async () => {
    if (!isConnected || !wallet) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      const cachedUser = getUserFromCache();
      if (cachedUser && cachedUser.wallet === wallet) {
        setCurrentUser(cachedUser);
        setIsLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate dummy user data
      const userData = generateDummyUser(wallet);
      
      // Cache the data
      setUserToCache(userData);
      setCurrentUser(userData);
    } catch (err) {
      setError('Failed to fetch user data');
      console.error('Error fetching user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [isConnected, wallet]);

  return {
    user: currentUser,
    isLoading,
    error,
    refetch: fetchUser
  };
};

/**
 * Hook to get all projects
 */
export const useGetAllProjects = () => {
  const [projects, setProjects] = useAtom(allProjectsAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [error, setError] = useAtom(errorMessageAtom);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      const cachedProjects = getProjectsFromCache();
      if (cachedProjects) {
        setProjects(cachedProjects);
        setIsLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate dummy projects data
      const projectsData = generateDummyProjects();
      
      // Cache the data
      setProjectsToCache(projectsData);
      setProjects(projectsData);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects
  };
};

/**
 * Hook to get user's projects
 */
export const useGetUserProjects = () => {
  const [userProjects, setUserProjects] = useAtom(userProjectsAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [error, setError] = useAtom(errorMessageAtom);
  const [currentUser] = useAtom(currentUserAtom);

  const fetchUserProjects = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      const cachedProjects = getUserProjectsFromCache();
      if (cachedProjects) {
        setUserProjects(cachedProjects);
        setIsLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Filter projects by current user
      const allProjects = generateDummyProjects();
      const userProjectsData = allProjects.filter(project => project.owner === currentUser.wallet);
      
      // Cache the data
      setUserProjectsToCache(userProjectsData);
      setUserProjects(userProjectsData);
    } catch (err) {
      setError('Failed to fetch user projects');
      console.error('Error fetching user projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProjects();
  }, [currentUser]);

  return {
    projects: userProjects,
    isLoading,
    error,
    refetch: fetchUserProjects
  };
};

/**
 * Hook to get invested projects
 */
export const useGetInvestedProjects = () => {
  const [investedProjects, setInvestedProjects] = useAtom(investedProjectsAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [error, setError] = useAtom(errorMessageAtom);
  const [currentUser] = useAtom(currentUserAtom);

  const fetchInvestedProjects = async () => {
    if (!currentUser?.investments) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      const cachedProjects = getInvestedProjectsFromCache();
      if (cachedProjects) {
        setInvestedProjects(cachedProjects);
        setIsLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get projects based on user investments
      const allProjects = generateDummyProjects();
      const investedProjectsData = currentUser.investments.map(investment => {
        return allProjects.find(project => 
          project.owner === investment.projectOwner && project.index === investment.index
        );
      }).filter(Boolean) as Project[];
      
      // Cache the data
      setInvestedProjectsToCache(investedProjectsData);
      setInvestedProjects(investedProjectsData);
    } catch (err) {
      setError('Failed to fetch invested projects');
      console.error('Error fetching invested projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestedProjects();
  }, [currentUser]);

  return {
    projects: investedProjects,
    isLoading,
    error,
    refetch: fetchInvestedProjects
  };
};

/**
 * Hook to get selected project
 */
export const useGetSelectedProject = (projectId?: string) => {
  const [selectedProject, setSelectedProject] = useAtom(selectedProjectAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [error, setError] = useAtom(errorMessageAtom);

  const fetchSelectedProject = async () => {
    if (!projectId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      const cachedProject = getSelectedProjectFromCache();
      if (cachedProject) {
        setSelectedProject(cachedProject);
        setIsLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Find project by ID (in this case, we'll use owner+index as ID)
      const allProjects = generateDummyProjects();
      const project = allProjects.find(p => `${p.owner}-${p.index}` === projectId);
      
      if (project) {
        setSelectedProjectToCache(project);
        setSelectedProject(project);
      } else {
        setError('Project not found');
      }
    } catch (err) {
      setError('Failed to fetch project details');
      console.error('Error fetching project:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSelectedProject();
  }, [projectId]);

  return {
    project: selectedProject,
    isLoading,
    error,
    refetch: fetchSelectedProject
  };
}; 