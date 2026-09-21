import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { DemoDefinition } from "../../demos";
import { Button, CodeBlock, Modal } from "../../theme";

interface CodeModalProps {
  demo: DemoDefinition;
  open: boolean;
  onClose: () => void;
}

export default function CodeModal({ demo, open, onClose }: CodeModalProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(demo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${demo.title}: minimal implementation`}
      subtitle="Everything this demo does, without the UI."
      actions={
        <Button
          variant={copied ? "accent" : "secondary"}
          size="sm"
          onClick={copy}
          icon={copied ? <Check size={16} /> : <Copy size={16} />}
        >
          {copied ? "Copied" : "Copy"}
        </Button>
      }
    >
      <div className="flex flex-col gap-4 p-6">
        <CodeBlock
          code="npm install open-jev @huggingface/transformers"
          language="bash"
          compact
        />
        <CodeBlock code={demo.code} />
      </div>
    </Modal>
  );
}
