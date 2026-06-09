import { Outlet } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useMediaQuery';

export default function MainContent() {
  const isMobile = useIsMobile();

  return (
    <main
      style={{
        marginLeft: isMobile ? 0 : 80,
        paddingTop: 10,
        paddingBottom: isMobile ? 70 : 20,
        paddingLeft: isMobile ? 10 : 10,
        paddingRight: 10,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <Outlet />
    </main>
  );
}
