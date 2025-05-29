import { Router } from 'express';

import { authorizeRoles } from '../../middleware/role-checker';
import { currentUser } from '../../middleware/current-user';
import { authenticate } from '../../middleware/auth';
import {
  create,
  findAll,
  findOne,
  getServiceByUser,
  remove,
  approveOrReject,
  update,
} from './service.controller';
import {
  createServiceValidator,
  updateServiceValidator,
  updateStatusValidator,
} from './service.validator';
import { validateRequest } from '../../middleware/validate';

const serviceRouter = Router();

serviceRouter.post(
  '/service',
  authenticate,
  authorizeRoles('FREELANCER', 'ADMIN'),
  createServiceValidator,
  validateRequest,
  create
);

serviceRouter.get('/service', currentUser, findAll);
serviceRouter.get('/service/:id', currentUser, findOne);

serviceRouter.put(
  '/service/:id',
  authenticate,
  authorizeRoles('FREELANCER', 'ADMIN'),
  updateServiceValidator,
  validateRequest,
  update
);
serviceRouter.delete(
  '/service/:id',
  authenticate,
  authorizeRoles('FREELANCER', 'ADMIN'),
  remove
);
serviceRouter.put(
  '/service/approve-or-reject/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  updateStatusValidator,
  validateRequest,
  approveOrReject
);
serviceRouter.get('/service/get-by-user/:userId', getServiceByUser);

export default serviceRouter;
