import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const ServerRestartButton = () => {
  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <Button
      onClick={handleRestart}
      variant="outline"
      className="fixed top-4 right-4 z-50"
    >
      <RefreshCw className="w-4 h-4 mr-2" />
      Reiniciar Servidor
    </Button>
  );
};

export default ServerRestartButton; 