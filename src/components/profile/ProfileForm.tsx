
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfileData {
  full_name: string | null;
  user_type: string | null;
}

const ProfileForm = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    user_type: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, user_type')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProfile(data);
      }
    } catch (error: any) {
      toast.error("Erro ao carregar perfil", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          user_type: profile.user_type,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (error) throw error;
      toast.success("Perfil atualizado com sucesso");
    } catch (error: any) {
      toast.error("Erro ao atualizar perfil", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const userTypes = [
    { value: 'concurseiro', label: 'Concurseiro' },
    { value: 'oab', label: 'OAB' },
    { value: 'universitario', label: 'Universitário' },
    { value: 'advogado', label: 'Advogado' },
  ];

  return (
    <form onSubmit={updateProfile} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nome Completo</Label>
        <Input
          id="fullName"
          value={profile.full_name || ''}
          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
          placeholder="Seu nome completo"
        />
      </div>

      <div className="space-y-2">
        <Label>Tipo de Perfil</Label>
        <Select
          value={profile.user_type || ''}
          onValueChange={(value) => setProfile({ ...profile, user_type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione seu perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {userTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  );
};

export default ProfileForm;
