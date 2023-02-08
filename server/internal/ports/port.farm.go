package port

type FarmRepository interface {
	// Get(context.Context, *model.Farm, uuid.UUID) error
	// Create(context.Context, uuid.UUID, string, string) error
}

type FarmService interface {
	// GetFarmByUUID(context.Context, uuid.UUID) (*model.Farm, error)
	// CreateFarm(context.Context, uuid.UUID, string, string) error
}
