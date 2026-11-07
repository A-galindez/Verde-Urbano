import { Sprout, BookOpen, ShoppingBag } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <HeroSection />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          title="Blog Multiusuario"
          description="Publicá tus experiencias, descubrí artículos sobre siembra y dejá tus comentarios a la comunidad."
          href="/blog"
          linkText="Ver publicaciones"
          icon={BookOpen}
        />

        <FeatureCard
          title="Mi Huerta"
          description="Seguí de cerca el crecimiento de tus cultivos y consultá tu calendario personalizado de riego."
          href="/huerta"
          linkText="Gestionar plantas"
          icon={Sprout}
        />

        <FeatureCard
          title="Insumos & Talleres"
          description="Encontrá semillas, herramientas orgánicas e inscribite a eventos y talleres de capacitación."
          href="/insumos"
          linkText="Ver catálogo"
          icon={ShoppingBag}
        />
      </section>
    </div>
  );
}