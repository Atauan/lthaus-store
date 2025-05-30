
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StoreInfoSettings from '@/components/settings/StoreInfoSettings';
import { Settings as SettingsIcon, Store, User, Bell, Shield } from 'lucide-react';

const Settings = () => {
  return (
    <PageTransition>
      <div className="min-h-screen lg:pl-64 pt-16">
        <div className="container mx-auto px-4 pb-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <SettingsIcon className="h-6 w-6" /> Configurações
              </h1>
              <p className="text-muted-foreground">
                Gerencie as configurações do sistema
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="store" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="store" className="flex items-center gap-1">
                <Store className="h-4 w-4" /> Loja
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-1">
                <User className="h-4 w-4" /> Conta
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-1">
                <Bell className="h-4 w-4" /> Notificações
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1">
                <Shield className="h-4 w-4" /> Segurança
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="store" className="space-y-6">
              <StoreInfoSettings />
            </TabsContent>
            
            <TabsContent value="account">
              <div className="bg-white rounded-lg shadow-soft p-6">
                <p className="text-muted-foreground">
                  Configurações de conta serão implementadas em breve.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications">
              <div className="bg-white rounded-lg shadow-soft p-6">
                <p className="text-muted-foreground">
                  Configurações de notificações serão implementadas em breve.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="security">
              <div className="bg-white rounded-lg shadow-soft p-6">
                <p className="text-muted-foreground">
                  Configurações de segurança serão implementadas em breve.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
};

export default Settings;
