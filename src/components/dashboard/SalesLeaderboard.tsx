'use client';

import React from 'react';
import { Card, CardHeader, CardBody, Avatar, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { VentasVendedor } from '@/types';
import { Trophy, Target } from 'lucide-react';

interface SalesLeaderboardProps {
  data: VentasVendedor[];
}

export function SalesLeaderboard({ data }: SalesLeaderboardProps) {
  const sortedData = [...data].sort((a, b) => b.ventas - a.ventas);

  return (
    <Card>
      <CardHeader
        title="Ranking de Vendedores"
        subtitle="Desempeño del mes actual"
        action={
          <Badge variant="primary">
            <Trophy size={12} className="mr-1" />
            Diciembre 2024
          </Badge>
        }
      />
      <CardBody className="space-y-4">
        {sortedData.map((vendedor, index) => {
          const porcentajeMeta = (vendedor.ventas / vendedor.meta) * 100;
          const cumplioMeta = porcentajeMeta >= 100;

          return (
            <div key={vendedor.vendedorId} className="flex items-center gap-4">
              {/* Position */}
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-zinc-100 text-zinc-600' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-zinc-50 text-zinc-500'}
              `}>
                {index + 1}
              </div>

              {/* Avatar & Name */}
              <Avatar name={vendedor.vendedorNombre} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900 truncate">
                  {vendedor.vendedorNombre}
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Target size={12} />
                  <span>Meta: {formatCurrency(vendedor.meta)}</span>
                </div>
              </div>

              {/* Sales Amount */}
              <div className="text-right">
                <p className="font-semibold text-zinc-900">
                  {formatCurrency(vendedor.ventas)}
                </p>
                <div className="flex items-center gap-1.5 justify-end mt-1">
                  <div className="w-16 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${cumplioMeta ? 'bg-success-500' : 'bg-syllet-500'
                        }`}
                      style={{ width: `${Math.min(porcentajeMeta, 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${cumplioMeta ? 'text-success-600' : 'text-zinc-500'
                    }`}>
                    {porcentajeMeta.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
