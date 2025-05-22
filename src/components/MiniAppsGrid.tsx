
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TipCalculator from './mini-apps/TipCalculator';
import { MiniApp } from '@/lib/types';

// Helper function to dynamically import mini-apps
const getMiniApp = (componentName: string) => {
  switch (componentName) {
    case 'TipCalculator':
      return <TipCalculator />;
    default:
      return <div>App not found</div>;
  }
};

// Default mini-apps
const defaultMiniApps: MiniApp[] = [
  {
    id: 'tip-calculator',
    name: 'Tip Calculator',
    description: 'Calculate tips and split bills',
    icon: 'calculator',
    component: 'TipCalculator',
    active: true
  },
  // More mini-apps can be added here
];

const MiniAppsGrid = () => {
  const [miniApps] = useState<MiniApp[]>(defaultMiniApps);
  const [activeApp, setActiveApp] = useState<string>(miniApps[0]?.id || '');
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Mini Tools</h2>
      
      <Tabs value={activeApp} onValueChange={setActiveApp}>
        <TabsList className="mb-4">
          {miniApps.map(app => (
            <TabsTrigger key={app.id} value={app.id}>
              {app.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {miniApps.map(app => (
          <TabsContent key={app.id} value={app.id} className="mt-0">
            <Card>
              <CardContent className="p-6">
                {getMiniApp(app.component)}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MiniAppsGrid;
