import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
// import { doCreate, doEdit, permissions as departmentPermissions } from '@/api/departmentManagement';

const { Item } = Form;

const DepartmentOperation = ({
  isCreateDepartment = false,
  departmentData = {},
  fetchData,
}) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  //   const departmentPermissions = departmentPermissions;

  const title = isCreateDepartment ? '创建部门' : '编辑部门';
  const buttonName = isCreateDepartment ? '创建' : '编辑';

  useEffect(() => {
    if (!isCreateDepartment) {
      form.setFieldsValue(departmentData);
    }
  }, [departmentData, form, isCreateDepartment]);

  const handleClose = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const { name, sort } = values;
        const formData = { name, sort };
        if (isCreateDepartment) {
          // await doCreate(formData);
          message.success('创建成功');
        } else {
          // formData.id = departmentData.id;
          // await doEdit(formData);
          message.success('编辑成功');
        }
        fetchData();
        handleClose();
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  return (
    <div className="department-operation">
      <Modal
        title={title}
        visible={visible}
        width={400}
        onCancel={handleClose}
        footer={null}
      >
        <div className="wrap-content">
          <Form
            form={form}
            name="departmentForm"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
          >
            <Item
              label="部门名称"
              name="name"
              rules={[
                { required: true, message: '请输入部门名称' },
                { min: 2, max: 60, message: '长度在 2 到 60 个字符' },
              ]}
            >
              <Input />
            </Item>
            <Item label="排序" name="sort">
              <Input />
            </Item>
            <Item>
              <Button
                type="primary"
                // disabled={
                //   (!checkPermission(departmentPermissions.doCreate) && isCreateDepartment) ||
                //   (!checkPermission(departmentPermissions.doEdit) && !isCreateDepartment)
                // }
                onClick={handleSubmit}
              >
                {buttonName}
              </Button>
            </Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentOperation;
