using MAC.DTO.Dtos;
using FluentValidation;

namespace MAC.API.Validations
{
    public class FlujoCajaEsfaValidator : AbstractValidator<FlujoCajaEsfaDto>
    {
        public FlujoCajaEsfaValidator()
        {
            RuleFor(fcd => fcd.CodItem)
                .Matches("^ESF[0-9]{3}$");
        }
    }
}
