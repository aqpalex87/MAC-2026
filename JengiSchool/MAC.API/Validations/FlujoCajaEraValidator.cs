using MAC.DTO.Dtos;
using FluentValidation;

namespace MAC.API.Validations
{
    public class FlujoCajaEraValidator : AbstractValidator<FlujoCajaEraDto>
    {
        public FlujoCajaEraValidator()
        {
            RuleFor(fcd => fcd.CodItem).Matches("^ERA[0-9]{3}$");
            RuleFor(fcd => fcd.Descripcion).MaximumLength(90);
        }
    }
}
