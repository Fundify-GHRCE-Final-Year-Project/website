import { atom } from 'jotai';
import { User, Project } from '@/types/global';

// User state
export const currentUserAtom = atom<User | null>(null);
export const isUserConnectedAtom = atom<boolean>(true);
export const userWalletAtom = atom<string | null>(null);

// Projects state
export const allProjectsAtom = atom<Project[]>([]);
export const userProjectsAtom = atom<Project[]>([]);
export const investedProjectsAtom = atom<Project[]>([]);
export const selectedProjectAtom = atom<Project | null>(null);

// UI state
export const isLoadingAtom = atom<boolean>(false);
export const errorMessageAtom = atom<string | null>(null);
export const successMessageAtom = atom<string | null>(null);

// Navigation state
export const currentPageAtom = atom<string>('projects');

// Derived atoms
export const hasInvestmentsAtom = atom((get) => {
  const user = get(currentUserAtom);
  return user?.investments && user.investments.length > 0;
});

export const hasProjectsAtom = atom((get) => {
  const user = get(currentUserAtom);
  return user?.projectCount && user.projectCount > 0;
});

export const projectsLoadingAtom = atom((get) => {
  return get(isLoadingAtom);
});

export const userProfileCompleteAtom = atom((get) => {
  const user = get(currentUserAtom);
  if (!user) return false;
  
  return !!(
    user.name &&
    user.country &&
    user.role &&
    user.skills.length > 0 &&
    user.linkedin &&
    user.x &&
    user.github
  );
}); 