using MAC.DTO.Dtos;
using FluentValidation;

namespace MAC.API.Validations
{

    public class RequestParametroVersionValidator : AbstractValidator<ParametroVersionDto>
    {
        public RequestParametroVersionValidator()
        {
            //RuleFor(s => s.DescripcionVersion)
            //    .NotEmpty()
            //    .MaximumLength(50);

            //RuleFor(s => s.Abreviatura)
            //    .MaximumLength(5);

            //RuleFor(s => s.ParametrosEFI)
            //    .NotEmpty()
            //    .MaximumLength(50);
        }
    }
}
