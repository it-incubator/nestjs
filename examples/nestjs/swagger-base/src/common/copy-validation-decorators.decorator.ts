import { applyDecorators } from '@nestjs/common';
import { getFromContainer, MetadataStorage } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Copies validation and Swagger decorators from one class property to another.
 *
 * @param fromClass - The source class constructor containing the decorators.
 * @param propertyKey - The name of the property in the source class to copy decorators from.
 */
export function CopyValidationDecorators(
  fromClass: new (...args: any[]) => any,
  propertyKey: string,
) {
  const metadataStorage = getFromContainer(MetadataStorage);

  // Get all validation metadata for the specified class and property
  const validationMetadatas = metadataStorage.getTargetValidationMetadatas(
    fromClass,
    null,
    false,
    false,
  );

  const propertyValidationMetadatas = validationMetadatas.filter(
    (meta) => meta.propertyName === propertyKey,
  );

  // Extract Swagger-related metadata
  const swaggerMetadata: Record<string, any> = {};
  propertyValidationMetadatas.forEach((meta) => {
    if (meta.type === 'min') {
      swaggerMetadata.minimum = meta.constraints[0];
    }
    if (meta.type === 'max') {
      swaggerMetadata.maximum = meta.constraints[0];
    }
    if (meta.type === 'isOptional') {
      swaggerMetadata.required = false;
    }
  });

  const validationDecorators = propertyValidationMetadatas.map((meta) => {
    const decoratorFn = Reflect.get(meta.constraintCls?.prototype, meta.type);
    return decoratorFn ? decoratorFn(...(meta.constraints || [])) : null;
  });

  const swaggerDecorator = ApiProperty({
    description: `${propertyKey} field`,
    ...swaggerMetadata,
  });

  return applyDecorators(
    ...validationDecorators.filter(Boolean),
    swaggerDecorator,
  );
}
