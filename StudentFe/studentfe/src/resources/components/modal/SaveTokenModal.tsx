import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

interface SaveTokenModalProps {
  visible: boolean;
  onHide: () => void;
  onSave: () => void;
  onDiscard: () => void;
}

const SaveTokenModal: React.FC<SaveTokenModalProps> = ({
  visible,
  onHide,
  onSave,
  onDiscard,
}) => {
  return (
    <Dialog
      header="Lưu token"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={onHide}
      footer={
        <div>
          <Button label="No" icon="pi pi-times" onClick={onDiscard} />
          <Button label="Yes" icon="pi pi-check" onClick={onSave} />
        </div>
      }
    >
      <p>Bạn có muốn duy trì quyền đăng nhập?</p>
    </Dialog>
  );
};

export default SaveTokenModal;
