import { useContext } from 'react';
import { Form, Modal, Input } from 'antd';
import { AppContext } from '@/context/AppProvider';
import { addDocument } from '@/firebase/service';
import { AuthContext } from '@/context/AuthProvider';

export default function AddRoomModal() {
  const { rooms, isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext);
  const {
    user: { uid },
  } = useContext(AuthContext);
  const [form] = Form.useForm();

  const handleOk = () => {
    if (rooms.find((room) => room.name === form.getFieldValue("name"))) {
      alert("Room exists");
      return;
    }
    if (!form.getFieldValue("description")) {
      form.setFieldsValue({ description: "No description" });
    }
    addDocument('rooms', { ...form.getFieldsValue(), members: [uid] });

    // reset form value
    form.resetFields();

    setIsAddRoomVisible(false);
  };

  const handleCancel = () => {
    // reset form value
    form.resetFields();

    setIsAddRoomVisible(false);
  };

  return (
    <div>
      <Modal
        title='Create room'
        open={isAddRoomVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout='vertical'>
          <Form.Item label={<><span style={{ color: 'red' }}>*</span>Room name</>} name={'name'}>
            <Input placeholder='Enter room name' />
          </Form.Item>
          <Form.Item label='Description' name='description'>
            <Input.TextArea placeholder='Enter description' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}