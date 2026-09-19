import type { ReactNode } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from './Header';
import type { OutletMenuContext } from './AppShell';

interface PageFrameProps {
  title: string;
  subtitle?: string;
  onExport?: () => void;
  children: ReactNode;
}

export function PageFrame({
  title,
  subtitle,
  onExport,
  children,
}: PageFrameProps) {
  const { openMenu } = useOutletContext<OutletMenuContext>();

  return (
    <>
      <Header
        title={title}
        subtitle={subtitle}
        onMenuClick={openMenu}
        onExport={onExport}
      />
      {children}
    </>
  );
}
