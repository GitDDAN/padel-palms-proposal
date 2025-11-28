import React from 'react';

export enum PackageType {
  BASIC = 'Basic Automation',
  PRO = 'Pro Suite',
  ENTERPRISE = 'Enterprise Solution'
}

export interface PackageDetails {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface StoryPanelProps {
  step: string;
  title: string;
  description: string;
  techInfo: string;
  visualAlt: string;
  visualComponent?: React.ReactNode;
  isLast?: boolean;
}