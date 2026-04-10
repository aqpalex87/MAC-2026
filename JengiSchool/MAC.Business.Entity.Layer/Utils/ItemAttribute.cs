using System;

namespace MAC.Business.Entity.Layer.Utils
{
    [AttributeUsage(AttributeTargets.Property)]
    public class ItemAttribute : Attribute
    {
        public ItemAttribute(string codigo) => Codigo = codigo;
        public string Codigo { get; set; }
    }
}
