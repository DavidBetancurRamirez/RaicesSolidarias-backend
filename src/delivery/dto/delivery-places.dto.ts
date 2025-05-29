import { CreateDeliveryDto } from './create-delivery.dto';

import { Place } from '@/place/place.schema';

export class DeliveryPlacesDto extends CreateDeliveryDto {
  places?: Place[] | null;
}
