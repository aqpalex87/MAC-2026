using MAC.DTO.Dtos;
using FluentValidation;

namespace MAC.API.Validations
{
    public class MontoPlazoValidator : AbstractValidator<MontoPlazoDto>
    {
        public MontoPlazoValidator()
        {
            RuleFor(mp => mp.Anio)
                .InclusiveBetween(1900, 2500).WithName("Año");
            RuleFor(mp => mp.Mes)
                .InclusiveBetween(1, 12);
        }
    }
}
