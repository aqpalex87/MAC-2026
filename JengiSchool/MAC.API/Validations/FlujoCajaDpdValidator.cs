using MAC.DTO.Dtos;
using FluentValidation;

namespace MAC.API.Validations
{
    public class FlujoCajaDpdValidator : AbstractValidator<FlujoCajaDpdDto>
    {
        public FlujoCajaDpdValidator()
        {
            RuleFor(fcd => fcd.IdParametroDpd).Matches("^DPD[0-9]{2}$");
        }
    }
}
