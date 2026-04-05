"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, useAuth, initiateEmailSignIn, initiateEmailSignUp } from "@/firebase";
import { Loader2, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    setIsLoading(true);
    try {
      if (isSignUp) {
        initiateEmailSignUp(auth, email, password);
        toast({ title: "Conta criada!", description: "Bem-vindo ao Outlet Multimarcas Poranga." });
      } else {
        initiateEmailSignIn(auth, email, password);
        toast({ title: "Bem-vindo de volta!", description: "Acessando seu painel de controle." });
      }
    } catch (error: any) {
      toast({ 
        title: "Erro ao acessar", 
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive" 
      });
    } finally {
      // Small delay to allow Firebase to process state change
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  if (isUserLoading || (user && !isUserLoading)) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto bg-accent/10 p-3 rounded-full w-fit mb-2">
            <Store className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Outlet Multimarcas Poranga</CardTitle>
          <CardDescription>
            {isSignUp ? 'Crie sua conta para gerenciar seu estoque' : 'Acesse seu painel de controle de vendas'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                required 
                className="h-12 rounded-xl border-muted bg-slate-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                className="h-12 rounded-xl border-muted bg-slate-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pb-8">
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl font-bold bg-accent hover:bg-accent/90"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isSignUp ? 'Criar Conta' : 'Entrar')}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Já tem uma conta? Entre aqui' : 'Não tem conta? Cadastre sua loja'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </div>
  );
}
