/**
 * v1 routes
 */

// users routes
import { userRoute as userRouteV1 } from "@modules/user/v1/userRoute";
import { appSyncRoute  as appSyncRouteV1} from "@modules/appSync";
import { appointmentRoute  as appointmentRouteV1} from "@modules/appointment";
import { categoriesRoute  as categoryRouteV1} from "@modules/admin/category";
import { mediasRoute } from "@modules/admin/media";
import { brandsRoute } from "@modules/admin/brand";
import { attributesRoute } from "@modules/admin/attribute";
import { servicesRoute } from "@modules/admin/service";
import { appServicesRoute } from "@modules/service";

export const routes: any = [
	...userRouteV1,
	...appSyncRouteV1,
	...appointmentRouteV1,
	...categoryRouteV1,
	...mediasRoute,
	...brandsRoute,
	...attributesRoute,
	...servicesRoute,
	...appServicesRoute
];