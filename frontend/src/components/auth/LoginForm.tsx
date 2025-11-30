import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart3, AlertCircle, Loader2, Lock, Mail, ArrowRight } from 'lucide-react';
import authService from '../../services/authService';

interface LoginFormProps {
  onLogin: (name: string, company: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({
        username: email,
        password: password
      });

      const userName = response.usuario.username.split('@')[0] || 'Usuario';
      const company = 'Panadería Demo';

      onLogin(userName, company);
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      {/* Background Elements - Más sutiles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-200 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section - Más minimalista */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-sm mb-6 border border-slate-200">
            <BarChart3 className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-light text-slate-900 mb-3 tracking-tight">ECO300</h1>
          <p className="text-slate-600 text-base font-light">Sistema de Análisis Empresarial</p>
        </div>

        {/* Login Card - Más limpio */}
        <Card className="shadow-lg border border-slate-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-light text-center text-slate-900">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center text-slate-600 text-sm">
              Accede a tu panel de control
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-12 pl-10 text-sm border-slate-300 focus:border-blue-500 bg-white text-slate-900 placeholder:text-slate-400 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-12 pl-10 text-sm border-slate-300 focus:border-blue-500 bg-white text-slate-900 placeholder:text-slate-400 transition-colors"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-8 font-light">
          © 2025 ECO300 - Gestión Inteligente para PyMEs
        </p>
      </div>
    </div>
  );
}