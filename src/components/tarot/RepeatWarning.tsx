import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface RepeatWarningProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  spreadName: string;
}

export default function RepeatWarning({ isOpen, onConfirm, onCancel, spreadName }: RepeatWarningProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="温馨提示">
      <div className="flex flex-col items-center gap-4 text-center">
        <span style={{ fontSize: 48 }}>🤔</span>
        <p style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.8 }}>
          你今天已经进行过「{spreadName}」类的占卜了哦～
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          塔罗牌的能量需要时间来沉淀。同一天对同类问题多次占卜，
          牌面的指引可能会变得模糊不清，结果的准确性也会降低。
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          建议你静下心来体会第一次占卜的启示，
          或者尝试其他类型的占卜～
        </p>
        <div className="flex gap-3 mt-2">
          <Button variant="secondary" onClick={onCancel}>听你的，不抽了</Button>
          <Button variant="ghost" onClick={onConfirm}>我还是想再抽一次</Button>
        </div>
      </div>
    </Modal>
  );
}
