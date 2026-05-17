import { Router } from 'express';
import { LeadController } from '../controllers/LeadController';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createLeadSchema, updateLeadSchema, leadFiltersSchema } from '../../application/validation/schemas';
import { UserRole } from '../../shared/types/auth.types';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

// Routes accessible by all authenticated users
router.get('/', validate(leadFiltersSchema, 'query'), LeadController.getAll);
router.get('/stats', LeadController.getStats);
router.get('/export', authorize(UserRole.ADMIN), LeadController.exportCsv);
router.get('/:id', LeadController.getById);


// Create/Update/Delete - accessible by Admin and Sales users
router.post('/', validate(createLeadSchema), LeadController.create);
router.put('/:id', validate(updateLeadSchema), LeadController.update);

// Delete - Admin only
router.delete('/:id', authorize(UserRole.ADMIN), LeadController.delete);

export default router;
