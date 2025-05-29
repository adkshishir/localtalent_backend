import { asyncHandler } from '../../utils/async-handler';
import { successResponse } from '../../utils/response-handler';
import {
  createService,
  deleteService,
  getAll,
  getById,
  getByUserId,
  updateService,
  updateStatus,
} from './service.service';

export const create = asyncHandler(async (req, res) => {
  const data = req.body;
  const user = res.locals?.user;
  const service = await createService(data, user);
  successResponse(res, 'Service created successfully', service, 201);
});

export const update = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body;
  const user = res.locals?.user;
  const service = await updateService(id, data, user);
  successResponse(res, 'Service updated successfully', service);
});
export const findOne = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const service = await getById(id);
  successResponse(res, 'Service retrieved successfully', service);
});
export const findAll = asyncHandler(async (req, res) => {
  const user = res.locals?.user;
  const services = await getAll(user);
  successResponse(res, 'Services retrieved successfully', services);
});
export const remove = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const user = res.locals?.user;
  await deleteService(id, user);
  successResponse(res, 'Service deleted successfully', {});
});
export const approveOrReject = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const status = req.body.status || 'APPROVED';
  const service = await updateStatus(id, status);
  successResponse(res, 'Service Status updated successfully', service);
});

export const getServiceByUser = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  const services = await getByUserId(userId);
  successResponse(res, 'Services retrieved successfully', services);
});
