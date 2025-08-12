'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Plus } from "lucide-react";
import Link from "next/link";

export default function UserMenu() {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button variant="outline" size="sm">
            Login
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button size="sm">
            Registrar
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/post/new">
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Post
        </Button>
      </Link>
      
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <User className="w-4 h-4" />
        <span className="text-sm font-medium">{user.email}</span>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={signOut}
        className="flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Sair
      </Button>
    </div>
  );
}
