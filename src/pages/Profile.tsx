import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Edit, LogOut, Trash2 } from "lucide-react";
import ProfileForm from "@/components/profile/ProfileForm";
import Layout from "@/components/layout/Layout";
import { SubscriptionStatus } from "@/components/subscription/SubscriptionStatus";

const Profile = () => {
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    subscribed: false,
    subscription_tier: null as string | null,
    subscription_end: null as string | null,
  });

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair", {
        description: error.message
      });
    } else {
      navigate("/auth");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita."
    );

    if (confirmDelete) {
      const { error } = await supabase.rpc('delete_user_account');
      if (error) {
        toast.error("Erro ao excluir conta", {
          description: error.message
        });
      } else {
        toast.success("Conta excluída com sucesso");
        navigate("/auth");
      }
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="bg-card rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src="/placeholder.svg" alt="Avatar" />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col w-full gap-2">
                  <Button variant="outline" className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Alterar Foto
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair da Conta
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir Conta
                  </Button>
                </div>
              </div>
              
              <div className="flex-1">
                <ProfileForm />
              </div>
            </div>
          </div>

          <SubscriptionStatus 
            isSubscribed={subscriptionStatus.subscribed}
            subscriptionTier={subscriptionStatus.subscription_tier}
            subscriptionEnd={subscriptionStatus.subscription_end}
            onRefresh={checkSubscription}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
