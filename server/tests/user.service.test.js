const test = require('node:test');
const assert = require('node:assert/strict');

const userService = require('../src/services/user.service');
const userRepository = require('../src/repositories/user.repository');

test('updateMyProfile only persists allowed profile fields', async () => {
  const originalUpdateById = userRepository.updateById;
  let updatedPayload;

  userRepository.updateById = async (id, data) => {
    updatedPayload = { id, data };
    return { _id: id, ...data };
  };

  try {
    const result = await userService.updateMyProfile('user-1', {
      name: 'Asha',
      mobile: '9876543210',
      role: 'ADMIN',
      password: 'should-not-save',
      address: '12 Main Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
    });

    assert.equal(result.name, 'Asha');
    assert.equal(result.address, '12 Main Road');
    assert.equal(updatedPayload.id, 'user-1');
    assert.equal(updatedPayload.data.role, undefined);
    assert.equal(updatedPayload.data.password, undefined);
    assert.deepEqual(updatedPayload.data, {
      name: 'Asha',
      mobile: '9876543210',
      address: '12 Main Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
    });
  } finally {
    userRepository.updateById = originalUpdateById;
  }
});
