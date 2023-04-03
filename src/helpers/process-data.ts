export function mapIds<TEntity extends { id: string }>(entities: TEntity[]) {
  return entities.map((entity) => entity.id);
}
